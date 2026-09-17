package com.careerlink.application.client;

public record RemoteApiResponse<T>(boolean success, String message, T data) {}
