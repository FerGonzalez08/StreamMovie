package dao;

public interface CRUD<T> 
{
    void create(T obj);
    T read(String id);
    void update(T obj);
    void delete(String id);
}
