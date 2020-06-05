/**
 * Animates the photo of the merchandise going into the cart.
 */
export default function toss(src: HTMLDivElement): void {
    // Create a ball
    const ball = document.createElement('div');
    ball.className = 'basketball';
    // Size the ball
    const { style } = ball;
    const srcRect = src.getBoundingClientRect();
    const { width, height } = srcRect;
    style.width = `${width}px`;
    style.height = `${height}px`;
    style.backgroundImage = src.style.backgroundImage;
    // Position the ball at the beginning (the photo)
    const dest = document.getElementById('basket');
    if (!dest) {
        throw TypeError;
    }
    const destRect = dest.getBoundingClientRect();
    style.left = `${srcRect.x - destRect.x}px`;
    style.top = `${srcRect.y - destRect.y}px`;
    // Prepare cleanup
    ball.onanimationend = () => {
        ball.remove();
    };
    // Set it in motion
    dest.appendChild(ball);
}
