using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace TestWorker;

class Program
{
    static async Task Main(string[] args)
    {
        var hostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST") ?? "localhost";
        var portStr = Environment.GetEnvironmentVariable("RABBITMQ_PORT");
        var userName = Environment.GetEnvironmentVariable("RABBITMQ_USER") ?? "mquser";
        var password = Environment.GetEnvironmentVariable("RABBITMQ_PASS") ?? "mqpassword";

        if (!int.TryParse(portStr, out var port))
        {
            port = 5672;
        }

        var factory = new ConnectionFactory()
        {
            HostName = hostName,
            Port = port,
            UserName = userName,
            Password = password
        };

        await using var connection = await factory.CreateConnectionAsync();
        await using var channel = await connection.CreateChannelAsync();
        
        await channel.QueueDeclareAsync(queue: "test-queue", durable: false, exclusive: false, autoDelete: false);
        
        Console.WriteLine(" [*] Waiting for messages.");

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.ReceivedAsync += (obj, arg) =>
        {
            var body = arg.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine(" [x] Received {0}", message);
            return Task.CompletedTask;
        };
        
        await channel.BasicConsumeAsync("test-queue", true, consumer: consumer);
        
        Console.WriteLine(" [*] Worker is running. Press Ctrl+C to exit.");
        
        var tcs = new TaskCompletionSource();
        Console.CancelKeyPress += (sender, e) =>
        {
            e.Cancel = true;
            tcs.TrySetResult();
        };

        await tcs.Task;
    }
}