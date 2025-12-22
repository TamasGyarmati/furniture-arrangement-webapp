using BackendASP.Data;
using BackendASP.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendASP.Controllers;

[ApiController]
[Route("[controller]")]
public class RoomController(IRoomRepository repo) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<Room> GetRoom(int id) => await repo.ReadAsync(id);

    [HttpPut]
    public async Task EditRoom(Room room) => await repo.UpdateAsync(room);

    [HttpDelete("{id}")]
    public async Task DeleteRoom(int id) => await repo.DeleteAsync(id);
}