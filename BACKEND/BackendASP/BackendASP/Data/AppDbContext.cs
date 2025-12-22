using BackendASP.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendASP.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Item> Items { get; set; }
    public DbSet<Room> Rooms { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Room>().HasData(
            new Room
            {
                Id = 1,
                Height = 0,
                Width = 0,
            });
    }
}