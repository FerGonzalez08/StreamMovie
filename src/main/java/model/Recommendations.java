package model;

import dao.RecommendationsDAO;
import java.util.List;

public class Recommendations {

    public static List<String> getMostSearchedMovies() {
        return RecommendationsDAO.getMostSearchedMovies();
    }

    public static List<String> getTopMovies(int n) {
        return RecommendationsDAO.getTopMovies(n);
    }
}