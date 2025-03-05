const preview = async (req, res) => {
    const { content_type: contentType, token, host } = req.query

    if (!contentType || !token) {
        return res.status(401).json({ message: "Missing contentType and/or token" })
    }

    // TODO: Add proper token verification and error message
    // if (!pagePreviewData) {
    //   return res.status(401).json({ message: 'Invalid slug' })
    // }

    res.setPreviewData({ contentType, token, host })
    res.redirect("/_preview")
    res.end()
}

export default preview

// This is the old code before linting. TODO: Check if Preview is working
//
// export default async (req, res) => {
//     const { content_type: contentType, token, host } = req.query;

//     if (!contentType || !token) {
//         return res
//             .status(401)
//             .json({ message: 'Missing contentType and/or token' });
//     }

//     // TODO: Add proper token verification and error message
//     // if (!pagePreviewData) {
//     //   return res.status(401).json({ message: 'Invalid slug' })
//     // }

//     res.setPreviewData({ contentType, token, host });
//     res.redirect('/_preview');
//     res.end();
// };
