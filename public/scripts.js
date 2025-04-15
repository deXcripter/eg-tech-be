console.log(faceapi);

const run = async () => {
  //we need to load our models
  //loading the models is going to use await

  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("./models"),
    faceapi.nets.ageGenderNet.loadFromUri("./models"),
  ]);

  const face1 = document.getElementById("face");
  let faceAIData = await faceapi
    .detectAllFaces(face1)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withAgeAndGender();

  //   console.log(faceAIData);

  // get the canvas and setit ontop of the image and make it the same size
  const canvas = document.getElementById("canvas");
  canvas.style.left = face1.offsetLeft;
  canvas.style.top = face1.offsetTop;
  canvas.height = face1.height;
  canvas.width = face1.width;

  // let's draw our bounding box on our face/image
  faceAIData = faceapi.resizeResults(faceAIData, face1);
  faceapi.draw.drawDetections(canvas, faceAIData);
};

run();
