package com.example.dahaeng.domain.auth.dto;

import lombok.RequiredArgsConstructor;

import java.util.Map;

@RequiredArgsConstructor
public class GoogleResponse implements OAuth2Response{

    private final Map<String, Object> attributes;

    @Override
    public String getProvider() { return "google"; }

    @Override
    public String getProviderId() {
        return attributes.get("sub").toString();
    }

    @Override
    public String getEmail() {
        return attributes.get("email").toString();
    }

    @Override
    public String getName() {
        return attributes.get("name").toString();
    }

    @Override
    public String getProfileImageUrl() {
        Object v = attributes.get("picture");
        return v == null ? null : v.toString();
    }

}
