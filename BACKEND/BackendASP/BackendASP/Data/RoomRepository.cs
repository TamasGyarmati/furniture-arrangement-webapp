using BackendASP.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendASP.Data;

public class RoomRepository(AppDbContext context) : IRoomRepository
{
    public async Task<Room> ReadAsync(int id) => await context.Rooms.FirstOrDefaultAsync(x => x.Id == id)
        ?? throw new Exception("Not found");

    public async Task UpdateAsync(Room room)
    {
        var toUpdate = await ReadAsync(room.Id);
        
        toUpdate.Height = room.Height;
        toUpdate.Width = room.Width;

        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var toDelete = await ReadAsync(id);
        context.Rooms.Remove(toDelete);

        await context.SaveChangesAsync();
    }
}