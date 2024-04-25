//clearFiles
document.getElementById('clearFiles').addEventListener('submit', function(event) {
  event.preventDefault();
 
  fetch('/clear', {
     method: 'DELETE',
  })
  .then(response => response.text())
  .then(data => {
     console.log('Success:', data);
  })
  .catch((error) => {
     console.error('Error:', error);
  });
 });