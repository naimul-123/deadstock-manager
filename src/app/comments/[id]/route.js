import { comments } from '../data'
import { redirect } from 'next/navigation';
export async function GET(request, { params }) {
    const comment = comments.find(comment => comment.id === parseInt(params.id))
    if (parseInt(params.id) > comments.length) {
        redirect('/comments')
    }
    return Response.json(comment)
}
export async function PATCH(request, { params }) {
    const body = await request.json();
    const { text } = body;
    const index = comments.findIndex(comment => comment.id === parseInt(params.id))
    comments[index].text = text;

    return Response.json(comments[index])
}
export async function DELETE(_request, { params }) {
    const comment = comments.find(comment => comment.id === parseInt(params.id))
    const index = comments.findIndex(comment => comment.id === parseInt(params.id))

    const deletedComment = comments[index];
    comments.splice(index, 1)
    return Response.json(comments)
}