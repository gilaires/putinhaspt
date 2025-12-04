let photos: string[] = [];
let index: number = 0;

export function initSlider(photoList: string[]): void {
  photos = photoList;
  index = 0;
}

function updatePhoto(): void {
  const img = document.getElementById("mainPhoto") as HTMLImageElement;
  img.classList.remove("fade");

  setTimeout(() => {
    img.src = photos[index];
    img.classList.add("fade");
  }, 10);
}

export function nextPhoto(): void {
  if (index < photos.length - 1) {
    index++;
    updatePhoto();
  }
}

export function prevPhoto(): void {
  if (index > 0) {
    index--;
    updatePhoto();
  }
}
