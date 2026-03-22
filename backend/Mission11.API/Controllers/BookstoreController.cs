using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;

namespace Mission11.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private BookstoreContext _bookstoreContext;

        public BookstoreController(BookstoreContext temp)
        {
            _bookstoreContext = temp;
        }

        [HttpGet("GetBookstore")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, string sortOrder = "asc")
        {
            // 1. Start with the IQueryable
            var query = _bookstoreContext.Books.AsQueryable();

            // 2. Apply Sorting
            if (sortOrder.ToLower() == "des")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            // 3. Apply Pagination
            var bookList = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumberBooks = _bookstoreContext.Books.Count();

            return Ok(new
            {
                Books = bookList,
                TotalBooks = totalNumberBooks
            });
        }


    }
}
