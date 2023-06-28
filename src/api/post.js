import instance from "@/utils/request";

export function SubmitPost(data = {}) {
    return instance.request({
        method: "POST",
        url: "post/submit",
        data,
    });
}

export function GetPostList(data = {}) {
    return instance.request({
        method: "POST",
        url: "post/getPostList",
        data,
    });
}

export function BatchDelete(data = {}) {
    return instance.request({
        method: "POST",
        url: "post/delete",
        data,
    });
}