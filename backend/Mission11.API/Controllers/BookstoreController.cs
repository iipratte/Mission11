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
        [HttpGet("GetBookstore")]
        public IActionResult GetBooks(
            int pageSize = 5,
            int pageNum = 1,
            string sortOrder = "asc",
            [FromQuery] List<string>? bookCategories = null)
        {
            var query = _bookstoreContext.Books.AsQueryable();

            if (bookCategories != null && bookCategories.Any())
            {
                query = query.Where(b => bookCategories.Contains(b.Category));
            }

            if (sortOrder.ToLower() == "des" || sortOrder.ToLower() == "desc")
            {
                query = query.OrderByDescending(b => b.Title);
            }
            else
            {
                query = query.OrderBy(b => b.Title);
            }

            var totalNumberBooks = query.Count();

            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumberBooks
            });
        }

        [HttpGet("GetBookCategories")]
        public IActionResult GetBookCategories()
        {
            var categories = _bookstoreContext.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }

        [HttpGet("GetBook/{bookId}")]
        public IActionResult GetBook(int bookId)
        {
            var book = _bookstoreContext.Books.Find(bookId);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            return Ok(book);
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookstoreContext.Books.Add(newBook);
            _bookstoreContext.SaveChanges();

            return Ok(newBook);
        }

        [HttpPut("UpdateBook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook)
        {
            var existingBook = _bookstoreContext.Books.Find(bookId);
            if (existingBook == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _bookstoreContext.Books.Update(existingBook);
            _bookstoreContext.SaveChanges();

            return Ok(existingBook);
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var existingBook = _bookstoreContext.Books.Find(bookId);
            if (existingBook == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            _bookstoreContext.Books.Remove(existingBook);
            _bookstoreContext.SaveChanges();

            return NoContent();
        }

    }
}
