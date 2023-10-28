#include <napi.h>
#include <uv.h>

uv_loop_t* eventLoop;

void StartEventLoop(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  eventLoop = uv_default_loop();

  // Initialize and start your event loop here

  uv_timer_t timer;
  uv_timer_init(eventLoop, &timer);
  uv_timer_start(&timer, [](uv_timer_t* handle) {
    printf("Timer fired!\n");
  }, 1000, 1000);
}

// Implement your event loop here

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports["init"] = Napi::Function::New(env, StartEventLoop);
  return exports;
}

NODE_API_MODULE(myaddon, Init)