using BackendASP.Data;
using BackendASP.Models;

namespace BackendASP.Services;
public class RoomPlannerService(IRoomRepository roomRepo, IItemRepository itemRepo)
{
    public async Task<List<Coordinates>> GeneratePlanAsync(int roomId)
    {
        var roomData = await roomRepo.ReadAsync(roomId) ?? throw new Exception("No available room data.");
        var items = await itemRepo.ReadAllAsync();

        var planner = new RoomPlanner(roomData.Height, roomData.Width);
        var coordinates = new List<Coordinates>();

        foreach (var item in items)
        {
            var position = planner.TryPlaceFurniture(item);
            if (position != null)
            {
                coordinates.Add(position);
            }
        }

        return coordinates;
    }
}