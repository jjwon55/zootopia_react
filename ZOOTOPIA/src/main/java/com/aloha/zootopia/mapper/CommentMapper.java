    package com.aloha.zootopia.mapper;

    import com.aloha.zootopia.domain.Comment;
    import org.apache.ibatis.annotations.Mapper;

    import java.util.List;

    @Mapper
    public interface CommentMapper {

        List<Comment> findByPostId(Integer postId);
        void insert(Comment comment);
        void softDelete(Integer commentId);
        void updateContent(Comment comment);
        Comment findById(Integer commentId);

        List<Comment> findLostByPostId(Integer postId);
        void insertLost(Comment comment);
        void softDeleteLost(Integer commentId);
        void updateLostContent(Comment comment);
        Comment findLostById(Integer commentId);
            

    }
