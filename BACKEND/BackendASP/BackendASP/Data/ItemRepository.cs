using BackendASP.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendASP.Data;

public class ItemRepository(AppDbContext context) : IItemRepository
{
    public async Task CreateAsync(Item item)
    {
        await context.Items.AddAsync(item);
        await context.SaveChangesAsync();
    }
    
    public async Task<IEnumerable<Item>> ReadAllAsync() => await context.Items.ToListAsync();
    
    public async Task<Item> ReadAsync(int id) => await context.Items.FirstOrDefaultAsync(x => x.Id == id)
                                                 ?? throw new Exception("Not found");

    public async Task DeleteAsync(int id)
    {
        var toDelete = await ReadAsync(id);
        
        context.Items.Remove(toDelete);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAllAsync()
    {
        context.Items.RemoveRange(context.Items);
        await context.SaveChangesAsync();
    }
}