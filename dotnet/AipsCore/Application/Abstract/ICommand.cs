namespace AipsCore.Application.Abstract;

public interface ICommand<in TDto> where TDto : IDto
{
    Task ExecuteAsync(TDto param);
}