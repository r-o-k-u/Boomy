import time
import board
import busio
import adafruit_adxl34x
import asyncio
import websockets

i2c = busio.I2C(board.SCL, board.SDA)
accelerometer = adafruit_adxl34x.ADXL345(i2c)

async def send_acceleration_data(websocket, path):
    while True:
        x, y, z = accelerometer.acceleration
        data = {"x": x, "y": y, "z": z}
        await websocket.send(json.dumps(data))
        await asyncio.sleep(0.1)  # Send data every 100ms

start_server = websockets.serve(send_acceleration_data, "0.0.0.0", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
