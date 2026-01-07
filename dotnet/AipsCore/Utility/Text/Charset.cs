namespace AipsCore.Utility.Text;

public static class Charset
{
    public static char[] GetAlphanumericCharset()
    {
        var charset = new List<char>();

        // a–z
        for (char c = 'a'; c <= 'z'; c++)
            charset.Add(c);

        // A–Z
        for (char c = 'A'; c <= 'Z'; c++)
            charset.Add(c);

        // 0–9
        for (char c = '0'; c <= '9'; c++)
            charset.Add(c);

        return charset.ToArray();
    }
}