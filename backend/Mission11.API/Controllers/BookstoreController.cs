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
        public IActionResult GetBooks(int pageSize, int pageNum)
        {
            var something = _bookstoreContext.Books.Skip((pageNum - 1) * pageSize).Take(pageSize).ToList();

            var totalNumberBooks = _bookstoreContext.Books.Count();

            var someObject = (new
            {
                Books = something,
                TotalBooks = totalNumberBooks
            });

            return Ok(someObject);
        }


    }
}
