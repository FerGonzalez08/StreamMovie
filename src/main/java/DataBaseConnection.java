package src.main.java;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnection 
{
    private static final String URL = "jdbc:sqlserver://<your-server>.database.windows.net:1433;database=<your-db>";
    private static final String USER = "<your-username>";
    private static final String PASSWORD = "<your-password>";
    public static Connection getConnection() throws SQLException 
    {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
