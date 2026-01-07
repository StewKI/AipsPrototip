namespace AipsCore.Application.Abstract;

public interface IQuery<TDto> where TDto : IDto
{
    Task<TDto> ExecuteAsync();
}