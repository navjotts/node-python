# Node-Python ML Image Classification Model Boilerplate
Starter code to use NodeJS with a Python layer for the model. Useful for deploying deep learning models if you want to use NodeJS as your web framework. Includes an extremely basic front-end built with Pug.

By default, this boilerplate runs a pre-trained resnet34 model that classifies Black Bears, Grizzly Bears, and Teddy Bears (h/t to [fast.ai](http://fast.ai)).

> Extended from [Node-Python by navjotts](https://github.com/navjotts/node-python)

### Setup
In the root folder:

```
$ npm install
$ pip install -r requirements.txt
```

### Demo with Bear Classifier model
```
$ npm start
```

### Deploying your Image Classification Model
Export your Pytorch model as `model-name.pth`.

Put your `.pth` in `/models`.

At the top of `model_fastai.py` you'll see:
```py
# SETUP HERE
YOUR_CLASSES_HERE = ['black', 'grizzly', 'teddys'] # Your class labels
NAME_OF_PTH_FILE = 'stage-2' # Name of your exported `.pth` file
```

1. Add your class labels
2. Add the name of your `.pth`
3. If you put your `.pth` file somewhere other than `/models`, replace `PATH_TO_MODELS_DIR` with that directory.
4. `npm start`

> Something broken?
> https://twitter.com/zachcaceres
