import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.nio.file.Files;
import java.nio.file.Paths;

public class TestImport {
    public static void main(String[] args) throws Exception {
        String url = "jdbc:mysql://grupoinnovate.co:3306/grupoin6_finixsoftware?useSSL=false&allowPublicKeyRetrieval=true";
        String user = "grupoin6_finixuser";
        String pass = "FinixPass2027...";
        
        System.out.println("Connecting to database...");
        try (Connection conn = DriverManager.getConnection(url, user, pass)) {
            System.out.println("Connected.");
            
            String content = new String(Files.readAllBytes(Paths.get("inserts_solamente.sql")));
            String[] queries = content.split(";");
            
            try (Statement stmt = conn.createStatement()) {
                for (String q : queries) {
                    q = q.trim();
                    if (q.isEmpty()) continue;
                    
                    try {
                        stmt.execute(q);
                    } catch (Exception e) {
                        System.out.println("\nERROR EXECUTING QUERY:");
                        System.out.println(q.substring(0, Math.min(q.length(), 200)) + "...");
                        System.out.println("\nEXCEPTION:");
                        e.printStackTrace();
                        System.exit(1);
                    }
                }
            }
            System.out.println("ALL EXECUTED SUCCESSFULLY!");
        }
    }
}