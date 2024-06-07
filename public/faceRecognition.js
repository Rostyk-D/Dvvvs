document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const startButton = document.getElementById('startButton');
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('closeButton');
    const overlay = document.getElementById('overlay');
  
    let faceMatcher;
  
    startButton.addEventListener('click', () => {
      modal.style.display = 'flex';
      startVideo();
    });
  
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
      video.pause();
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    });
  
    async function startVideo() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      video.srcObject = stream;
      video.addEventListener('play', async () => {
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(overlay, displaySize);
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          overlay.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
          faceapi.draw.drawDetections(overlay, resizedDetections);
          faceapi.draw.drawFaceLandmarks(overlay, resizedDetections);
  
          if (resizedDetections.length > 0) {
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
            results.forEach((result, i) => {
              const box = resizedDetections[i].detection.box;
              const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
              drawBox.draw(overlay);
  
              if (result.label !== 'unknown' && result.distance < 0.6) {
                alert('Face recognized!');
                modal.style.display = 'none';
                video.pause();
                if (video.srcObject) {
                  video.srcObject.getTracks().forEach(track => track.stop());
                }
              }
            });
          }
        }, 100);
      });
    }
  
    async function loadLabeledImages() {
      const labels = ['person1'];
      return Promise.all(
        labels.map(async label => {
          const descriptions = [];
          for (let i = 1; i <= 1; i++) {
            const img = await faceapi.fetchImage(`/${label}.jpg`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
          }
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );
    }
  
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    ]).then(async () => {
      const labeledFaceDescriptors = await loadLabeledImages();
      faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
      console.log('Models and labeled images loaded');
    });
  });
  