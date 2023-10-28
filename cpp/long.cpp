#include <napi.h>
#include <uv.h>

uv_loop_t *eventLoop;
Napi::FunctionReference jsCallback;

struct TimerContext
{
    Napi::FunctionReference jsCallback;
};

void timer_callback(uv_timer_t *timer)
{
    TimerContext *context = static_cast<TimerContext *>(timer->data);
    // Call the JavaScript callback function
    Napi::Env env = context->jsCallback.Env();
    context->jsCallback.Call(env.Global(), {Napi::String::New(env, "Hello from C++")});
}

void StartEventLoop(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    jsCallback = Napi::Persistent(info[0].As<Napi::Function>());

    eventLoop = uv_default_loop();

    // Initialize and start your event loop here
    TimerContext *context = new TimerContext();
    context->jsCallback = jsCallback;

    uv_timer_t *timer = new uv_timer_t();
    timer->data = context;

    uv_timer_init(eventLoop, timer);
    uv_timer_start(timer, timer_callback, 0, 1000);
}
// Implement your event loop here

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
    exports["init"] = Napi::Function::New(env, StartEventLoop);
    return exports;
}

NODE_API_MODULE(myaddon, Init)