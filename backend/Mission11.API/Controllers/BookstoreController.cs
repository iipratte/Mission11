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

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize, int pageNum, string sortOrder = "asc", [FromQuery] List<string>? bookCategories = null)
        {
            var query = _bookstoreContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(p => bookCategories.Contains(p.Category));
            }

            query = sortOrder?.ToLower() == "desc"
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title);

            var totalNumberBooks = query.Count();

            var something = query.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();


            var someObject = (new
            {
                Books = something,
                TotalBooks = totalNumberBooks
            });

            return Ok(someObject);
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var bookCategories = _bookstoreContext.Books.Select(x => x.Category).Distinct().ToList();

            return Ok(bookCategories);
        }


    }
}
