using BackendASP.Models;

namespace BackendASP.Data;

public interface IRoomRepository
{
    Task<Room> ReadAsync(int id);
    Task UpdateAsync(Room room);
    Task DeleteAsync(int id);
}