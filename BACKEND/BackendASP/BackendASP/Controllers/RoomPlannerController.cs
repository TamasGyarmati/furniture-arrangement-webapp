using BackendASP.Models;
using BackendASP.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendASP.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomPlannerController(RoomPlannerService roomPlannerService) : ControllerBase
{
    [HttpGet("generate")]
    public async Task<List<Coordinates>> GenerateRoomPlanAsync()
        => await roomPlannerService.GeneratePlanAsync(1);
}