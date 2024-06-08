using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize, //item count per page
                CurrentPage = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize) //to get int number we use ceiling
            };
            AddRange(items);
        }

        public MetaData MetaData { get; set; }

        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // how many item 
            var items = await query.Skip((pageNumber - 1)*pageSize).Take(pageSize).ToListAsync(); // retrieves items from the specified page
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}
