export default function handler(req, res) {
    // Redirect to the frontend 404 page
    res.redirect(404, '/404');
}
