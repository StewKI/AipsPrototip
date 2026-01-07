namespace AipsCore.Domain.Common.Validation.Rules;

public abstract class AbstractCharsetRule : AbstractRule
{
    private readonly string _stringValue;
    private readonly char[] _charset;

    protected AbstractCharsetRule(string stringValue, char[] charset)
    {
        _stringValue = stringValue;
        _charset = charset;
    }
    
    public override bool Validate()
    {
        foreach (char character in _stringValue)
        {
            if (!_charset.Contains(character))
            {
                return false;
            }
        }
        return true;
    }
}