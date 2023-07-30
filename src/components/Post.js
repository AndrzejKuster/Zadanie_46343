import { useState } from 'react';
import './Post.css'
import axios from 'axios';

const Post = (props) => {

    const [likeCount, setLikeCount] = useState(props.post.likes.length);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [hasUserLiked, setHasUserLiked] = useState(props.post.likes.filter(like => like.username === props.user?.username).length !== 0);

    const deletePost = (id) => {
        axios.post('https://akademia108.pl/api/social-app/post/delete', {
            post_id: id,
        })
        .then((res) => {
            console.log(res.data);
            props.setPosts((posts) => {
                return posts.filter(post => post.id !== res.data.post_id);
            });
        })
    }

    const likePost = (id, isLiked) => {
        axios.post('https://akademia108.pl/api/social-app/post/'+(isLiked?'dislike' : 'like'), {
            post_id: id,
        })
        .then((res)=> {
            setLikeCount(likeCount + (isLiked ? -1 : 1));
            setHasUserLiked(!isLiked);
        })
    }

    const unfollow = (id) =>{
        axios.post('https://akademia108.pl/api/social-app/follows/disfollow', {
            leader_id: id,
        })
        .then(() => {
            props.getLatestPosts();
        })
        .catch((error) => {
            console.error(error);
        });
    };

    return (
        <div className='post'>
            <div className='avatar'>
                <img src={props.post.user.avatar_url} alt={props.post.user.username} />

            </div>
            <div className='postData'>
                <div className='postMeta'>
                    <div className='author'>{props.post.user.username}</div>
                    <div className='date'>{props.post.created_at.substring(0,10)}</div>
                </div>
                <div className='postContent'>{props.post.content}</div>
                <div className='likes'>
                    {props.user?.username === props.post.user.username && (<button className='btn' onClick={()=> setDeleteModalVisible(true)}>
                        Delete
                        </button>)}
                    
                    {props.user && props.user.username !== props.post.user.username && (<button className='btn' onClick={()=>unfollow(props.post.user.id)}>Unfollow</button>)}


                    {props.user && (
                    <button
                     className='btn'
                     onClick={()=>likePost(props.post.id, hasUserLiked)}>
                         {hasUserLiked ? "Dislike" : "Like"}
                    </button>
                    )}
                    
                    {likeCount}
                </div>

                {deleteModalVisible && (<div className='deleteConfirmation'>
                    <h3>Are You sure you want to delete this post?</h3>
                    <button className='btn yes' onClick={()=> deletePost(props.post.id)}>Yes</button>
                    <button className='btn no' onClick={()=> setDeleteModalVisible(false)}>No</button>
                </div>)}
            </div>
        </div>

    )
}

export default Post;