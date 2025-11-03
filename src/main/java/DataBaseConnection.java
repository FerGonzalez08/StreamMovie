
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DataBaseConnection {
    private static final String URL =
            "jdbc:sqlserver://proyectosdb.database.windows.net:1433;"
                    + "database=streamMovie_DB;"
                    + "user=adminProyectos@proyectosdb;"
                    + "password=Rojo01//;"
                    + "encrypt=true;"
                    + "trustServerCertificate=false;"
                    + "hostNameInCertificate=*.database.windows.net;"
                    + "loginTimeout=30;";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL);
    }

    // Metodo de prueba para validar conexión
    public static void main(String[] args) {
        try (Connection conn = getConnection()) {
            System.out.println("✅ Conexión exitosa a Azure SQL Database!");
        } catch (SQLException e) {
            System.out.println("❌ Error al conectar con la base de datos:");
            e.printStackTrace();
        }
    }
}