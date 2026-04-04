module com.project.ui {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.fasterxml.jackson.databind;

    opens com.project.ui to javafx.graphics, javafx.fxml, com.fasterxml.jackson.databind;
    exports com.project.ui;
}
