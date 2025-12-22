using BackendASP.Models;

namespace BackendASP.Data;

public interface IItemRepository
{
    Task CreateAsync(Item item);
    Task<IEnumerable<Item>> ReadAllAsync();
    Task<Item> ReadAsync(int id);
    Task DeleteAsync(int id);
    Task DeleteAllAsync();
}