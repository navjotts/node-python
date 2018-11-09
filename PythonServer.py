import json
from pathlib import Path
from fastai import *
from fastai.vision import *
import zerorpc

# SETUP HERE
YOUR_CLASSES_HERE = ['black', 'grizzly', 'teddys'] # Your class labels
NAME_OF_PTH_FILE = 'stage-2' # Name of your exported `.pth` file
PATH_TO_MODELS_DIR = Path('.') # by default just use /models in root dir

def setup_model(path_to_pth_file, learner_name_to_load, classes, resnet_num=34, tfms=get_transforms(), normalizer=None, **kwargs):
    "Initialize our learner for inference"
    # Import existing model weights
    data = ImageDataBunch.single_from_classes(path_to_pth_file, classes, tfms=tfms, device=torch.device('cpu'), **kwargs)
    # Normalize if preferred
    if (normalizer is not None): data.normalize(normalizer)
    # Specify resnet: 18, 34, 50, 101, 152
    resnet = get_resnet(resnet_num)
    learn = create_cnn(data, resnet, pretrained=False)
    learn.load(learner_name_to_load)
    return learn

def get_resnet(resnet_num=34):
    "Specify resnet: 18, 34, 50, 101, 152"
    return getattr(models, f'resnet{resnet_num}')

class PythonServer(object):
    def __init__(self, learner):
        self.learner = learner

    def predict_from_img(self, img_path):
        try:
            img = open_image(Path(img_path))
            pred_class,pred_idx,losses = self.learner.predict(img)
            print('Class pred:', pred_class)
            print('Pred-idx:', pred_idx)
            print('Losses:', losses)
            return json.dumps({ 'predict': pred_class })
        except Exception as e:
            print('Error during prediction:', e)
            raise e

try:
    path = PATH_TO_MODELS_DIR
    classes = YOUR_CLASSES_HERE
    learn = setup_model(path, 'stage-2', classes, normalizer=imagenet_stats)
    server = zerorpc.Server(PythonServer(learn))
    server.bind('tcp://0.0.0.0:4242')
    server.run()
    print('PythonServer running...')
except Exception as e:
    print('unable to start PythonServer:', e)
    raise e