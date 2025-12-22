using BackendASP.Data;
using BackendASP.Models;
using Microsoft.AspNetCore.Mvc;

namespace BackendASP.Controllers;

[ApiController]
[Route("[controller]")]
public class ItemController(IItemRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IEnumerable<Item>> GetItems() => await repo.ReadAllAsync();
    
    [HttpGet("{id}")]
    public async Task<Item> GetItem(int id) => await repo.ReadAsync(id);

    [HttpPost]
    public async Task CreateItem(Item item) => await repo.CreateAsync(item);

    [HttpDelete("{id}")]
    public async Task DeleteItem(int id) => await repo.DeleteAsync(id);

    [HttpDelete]
    public async Task DeleteAll() => await repo.DeleteAllAsync();
}