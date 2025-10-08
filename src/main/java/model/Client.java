package model;

import dao.ClientDAO;

public class Client extends User {

    public Client(String email, String birthdate, String userName, String password) {
        super(email, birthdate, userName, password, "client");
    }

    public void createProfile() {
        ClientDAO.create(this);
    }

    public void editProfile() {
        ClientDAO.update(this);
    }

    public void deleteProfile() {
        ClientDAO.delete(this.userName);
    }

    public void downloadMovie(String movieName) {
        // lógica descarga (puede consultar MovieDAO si necesario)
    }

    public void addFavorite(String movieName) {
        // lógica para agregar a favoritos (podría usar RecommendationsDAO)
    }
}
