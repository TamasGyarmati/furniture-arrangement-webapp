using BackendASP.Models;

namespace BackendASP.Services;
public class RoomPlanner
{
    int Height { get; }
    int Width { get; }
    string[,] Grid { get; }

    public RoomPlanner(int height, int width)
    {
        Height = height;
        Width = width;
        Grid = new string[height, width];
        
        for (int i = 0; i < height; i++)
        {
            for (int j = 0; j < width; j++)
            {
                Grid[i, j] = ".";
            }
        }
    }

    bool CanPlaceFurniture(int startX, int startY, Item item)
    {
        for (int i = 0; i < item.Height; i++)
        {
            for (int j = 0; j < item.Width; j++)
            {
                if (startX + i >= Height || startY + j >= Width || Grid[startX + i, startY + j] != ".")
                {
                    return false;
                }
            }
        }
        return true;
    }

    public Coordinates? TryPlaceFurniture(Item item)
    {
        for (int i = 0; i <= Height - item.Height; i++)
        {
            for (int j = 0; j <= Width - item.Width; j++)
            {
                if (CanPlaceFurniture(i, j, item))
                {
                    for (int x = 0; x < item.Height; x++)
                    {
                        for (int y = 0; y < item.Width; y++)
                        {
                            Grid[i + x, j + y] = item.Name.Length > 1 ? item.Name[..1] : item.Name;
                        }
                    }
                    return new Coordinates{ X = j, Y = i };
                }
            }
        }
        return null;
    }
}