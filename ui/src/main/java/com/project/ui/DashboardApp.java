package com.project.ui;

import javafx.application.Application;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.chart.BarChart;
import javafx.scene.chart.CategoryAxis;
import javafx.scene.chart.NumberAxis;
import javafx.scene.chart.XYChart;
import javafx.scene.control.*;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Main entry point for the Event Intelligence Dashboard UI.
 * This class uses JavaFX to create a graphical user interface.
 */
public class DashboardApp extends Application {

    private final ApiService apiService = new ApiService();
    private final TableView<Article> table = new TableView<>();
    private final BarChart<String, Number> barChart = createBarChart();
    private final Label statusLabel = new Label(""); // Start empty
    private final ProgressIndicator loadingIndicator = new ProgressIndicator();

    @Override
    public void start(Stage primaryStage) {
        
        // 1. Setup Table Columns
        TableColumn<Article, Long> idColumn = new TableColumn<>("ID");
        idColumn.setCellValueFactory(new PropertyValueFactory<>("id"));
        idColumn.setPrefWidth(50);

        TableColumn<Article, String> titleColumn = new TableColumn<>("Title");
        titleColumn.setCellValueFactory(new PropertyValueFactory<>("title"));
        titleColumn.setPrefWidth(220);

        TableColumn<Article, String> contentColumn = new TableColumn<>("Content");
        contentColumn.setCellValueFactory(new PropertyValueFactory<>("content"));
        contentColumn.setPrefWidth(580); 

        table.getColumns().addAll(idColumn, titleColumn, contentColumn);
        table.setPlaceholder(new Label("No articles found in database."));
        table.setStyle("-fx-font-size: 14px; -fx-background-radius: 8;");

        // 2. Create Refresh Button & Controls
        Button refreshBtn = new Button("🔄 Refresh Dashboard Data");
        refreshBtn.setStyle("-fx-font-weight: bold; -fx-font-size: 15px; -fx-padding: 10 25; -fx-background-color: #3498db; -fx-text-fill: white; -fx-background-radius: 15;");
        refreshBtn.setOnAction(e -> loadData());

        // 3. Layout the UI using BorderPane
        BorderPane root = new BorderPane();
        root.setPadding(new Insets(25));
        root.setStyle("-fx-background-color: #f4f7f6; -fx-font-family: 'Segoe UI', Arial, sans-serif;");

        // Top: Title & Primary Controls
        Label mainTitle = new Label("Event Intelligence Dashboard");
        mainTitle.setStyle("-fx-font-size: 34px; -fx-font-weight: bold; -fx-text-fill: #2c3e50;");
        
        loadingIndicator.setMaxSize(40, 40);
        loadingIndicator.setVisible(false);
        loadingIndicator.managedProperty().bind(loadingIndicator.visibleProperty());

        VBox topBox = new VBox(15);
        topBox.setPadding(new Insets(0, 0, 30, 0));
        topBox.setAlignment(Pos.CENTER);
        topBox.getChildren().addAll(mainTitle, refreshBtn, loadingIndicator, statusLabel);
        root.setTop(topBox);

        // Center: Main Data Table
        root.setCenter(table);

        // Bottom: Trend Visualization
        VBox bottomBox = new VBox(15);
        bottomBox.setPadding(new Insets(30, 0, 0, 0));
        Label trendLabel = new Label("📈 Live Trending Keyphrases Analysis");
        trendLabel.setStyle("-fx-font-size: 18px; -fx-font-weight: bold; -fx-text-fill: #34495e;");
        bottomBox.getChildren().addAll(trendLabel, barChart);
        root.setBottom(bottomBox);

        // 4. Scene and Stage
        Scene scene = new Scene(root, 950, 850); 
        primaryStage.setTitle("Event Intelligence Platform");
        primaryStage.setScene(scene);
        primaryStage.show();

        // Initial data load
        loadData();
    }

    private BarChart<String, Number> createBarChart() {
        CategoryAxis xAxis = new CategoryAxis();
        xAxis.setLabel("Words");

        NumberAxis yAxis = new NumberAxis();
        yAxis.setLabel("Frequency");

        BarChart<String, Number> chart = new BarChart<>(xAxis, yAxis);
        chart.setPrefHeight(200);
        chart.setLegendVisible(false);
        chart.setAnimated(false); // Disable animations for smoother updates
        return chart;
    }

    private void updateChartData(Map<String, Integer> trendData) {
        XYChart.Series<String, Number> series = new XYChart.Series<>();
        
        // 1. Identify Top 3 trends using Streams
        List<String> top3 = trendData.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(3)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        for (Map.Entry<String, Integer> entry : trendData.entrySet()) {
            series.getData().add(new XYChart.Data<>(entry.getKey(), entry.getValue()));
        }
        
        barChart.getData().clear();
        barChart.getData().add(series);

        // 2. Highlight Top 3 bars with distinct colors (Gold, Silver, Bronze)
        for (XYChart.Data<String, Number> data : series.getData()) {
            if (top3.contains(data.getXValue())) {
                int rank = top3.indexOf(data.getXValue());
                String color = switch (rank) {
                    case 0 -> "#FFD700"; // Gold
                    case 1 -> "#C0C0C0"; // Silver
                    case 2 -> "#CD7F32"; // Bronze
                    default -> "#ff4757";
                };
                // Inline styling for the bar node
                data.getNode().setStyle("-fx-bar-fill: " + color + "; -fx-background-radius: 5 5 0 0;");
            } else {
                data.getNode().setStyle("-fx-bar-fill: #54a0ff; -fx-opacity: 0.7;"); 
            }

            // Install Tooltip for exact count
            Tooltip tt = new Tooltip(data.getXValue() + ": " + data.getYValue());
            Tooltip.install(data.getNode(), tt);
        }
    }

    private void loadData() {
        statusLabel.setText("Fetching data...");
        loadingIndicator.setVisible(true);
        
        new Thread(() -> {
            List<Article> articles = apiService.fetchArticles();
            Map<String, Integer> trends = apiService.fetchTrends();
            
            Platform.runLater(() -> {
                loadingIndicator.setVisible(false);

                // Error checking: If API returned null, the backend is likely down
                if (articles == null || trends == null) {
                    statusLabel.setText("❌ Connection Failed!");
                    Alert alert = new Alert(Alert.AlertType.ERROR);
                    alert.setTitle("Error");
                    alert.setHeaderText("Backend Connection Failure");
                    alert.setContentText("The dashboard could not connect to the backend server.\n" +
                            "Please verify if the Spring Boot application is running on port 8080.");
                    alert.show();
                    return; // STOP execution if error
                }

                // Update Table
                table.setItems(FXCollections.observableArrayList(articles));
                
                // Update BarChart (words + counts)
                updateChartData(trends);

                // Show trend alert if data exists
                if (!trends.isEmpty())  {
                    String topWords = trends.entrySet().stream()
                            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                            .limit(3)
                            .map(Map.Entry::getKey)
                            .collect(java.util.stream.Collectors.joining(", "));

                    Alert alert = new Alert(Alert.AlertType.INFORMATION);
                    alert.setTitle("Trending Analysis");
                    alert.setHeaderText("New Trends Found!");
                    alert.setContentText("Trend Detected: " + topWords);
                    alert.show();
                }
                
                statusLabel.setText("Data refreshed successfully.");
            });
        }).start();
    }

    public static void main(String[] args) {
        // Launch the JavaFX application
        launch(args);
    }
}
