import json
from pathlib import Path
from fastai import *
from fastai.vision import *
import zerorpc

from test_python import test_me

class PythonServer(object):
    def test(self, param):
        return test_me(param)

    def predict_from_img(self, img_path):
        img = open_image(Path(img_path))
        _,_,losses = learner.predict(img)
        print(losses)
        json.dumps({ 'predict': losses })
        # return JSONResponse({
        #     "predictions": sorted(
        #         zip(cat_learner.data.classes, map(float, losses)),
        #         key=lambda p: p[1],
        #         reverse=True
        #     )
        # })

try:
    s = zerorpc.Server(PythonServer())
    s.bind('tcp://0.0.0.0:4242')
    s.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e
