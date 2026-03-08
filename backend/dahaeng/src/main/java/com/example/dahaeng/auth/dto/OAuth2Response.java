package com.example.dahaeng.auth.dto;

import java.util.Map;

public interface OAuth2Response {

    //?œê³µ??(Ex. naver, google, ...)
    String getProvider();

    //?œê³µ?ì—??ë°œê¸‰?´ì£¼???„ì´??ë²ˆí˜¸)
    String getProviderId();

    //?´ë©”??
    String getEmail();

    //?¬ìš©???¤ëª… (?¤ì •???´ë¦„)
    String getName();

    // ?¬ìš©???„ë¡œ???´ë?ì§€ url
    String getProfileImageUrl();

}
