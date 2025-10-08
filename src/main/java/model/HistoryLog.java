package model;

import dao.HistoryLogDAO;

public class HistoryLog {
    private String nameMovie;
    private int searchTimes;

    public HistoryLog(String nameMovie, int searchTimes) {
        this.nameMovie = nameMovie;
        this.searchTimes = searchTimes;
    }

    // getters y setters

    public void save() {
        HistoryLogDAO.update(this);
    }
}