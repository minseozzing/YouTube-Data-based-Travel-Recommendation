package com.example.dahaeng.domain.recommend.Service;

import com.example.dahaeng.domain.recommend.dto.response.RecommendCitiesResponse;
import com.example.dahaeng.global.config.ExternalApiProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@Service
@Primary
@RequiredArgsConstructor
public class NewsApiSearchService implements NewsSearchService {

    private final ExternalApiProperties externalApiProperties;
    private final RestClient.Builder restClientBuilder;
    private final ChatClient.Builder chatClientBuilder;

    @Override
    public RecommendCitiesResponse.NewsInsight searchAndSummarize(String city, String country, double newsPenaltyScore) {
        if (externalApiProperties.newsapi() == null || !StringUtils.hasText(externalApiProperties.newsapi().key())) {
            return new RecommendCitiesResponse.NewsInsight(
                    city + " 관련 뉴스 API 키가 설정되지 않아 요약을 생성하지 못했습니다.",
                    List.of()
            );
        }

        RestClient restClient = restClientBuilder.baseUrl(externalApiProperties.newsapi().baseUrl()).build();
        String query = buildQuery(city, country, newsPenaltyScore);
        String uri = UriComponentsBuilder.fromPath("/v2/everything")
                .queryParam("q", query)
                .queryParam("language", "en")
                .queryParam("sortBy", "publishedAt")
                .queryParam("pageSize", 5)
                .queryParam("from", LocalDate.now().minusDays(30))
                .build()
                .toUriString();

        NewsApiResponse response;
        try {
            response = restClient.get()
                    .uri(uri)
                    .header("X-Api-Key", externalApiProperties.newsapi().key())
                    .retrieve()
                    .body(NewsApiResponse.class);
        } catch (Exception e) {
            return new RecommendCitiesResponse.NewsInsight(
                    city + " 관련 뉴스를 불러오지 못했습니다.",
                    List.of()
            );
        }

        List<ArticleItem> rawArticles = response == null || response.articles() == null
                ? List.of()
                : response.articles().stream().limit(5).toList();

        List<RecommendCitiesResponse.Article> articles = rawArticles.stream()
                .map(article -> new RecommendCitiesResponse.Article(
                        safe(article.title()),
                        safe(article.url()),
                        article.urlToImage()
                ))
                .toList();

        String summary = summarizeArticles(city, country, newsPenaltyScore, rawArticles);
        return new RecommendCitiesResponse.NewsInsight(summary, articles);
    }

    private String buildQuery(String city, String country, double newsPenaltyScore) {
        if (newsPenaltyScore <= -8) {
            return "\"" + city + "\" AND \"" + country + "\" AND (travel OR safety OR crime OR protest OR accident)";
        }
        return "\"" + city + "\" AND \"" + country + "\" AND (travel OR tourism OR attraction OR restaurant OR festival)";
    }

    private String summarizeArticles(String city, String country, double newsPenaltyScore, List<ArticleItem> articles) {
        if (articles.isEmpty()) {
            return city + " 관련 최근 기사를 찾지 못했습니다.";
        }

        String articleBlock = articles.stream()
                .map(article -> "- 제목: " + safe(article.title()) + "\n  설명: " + safe(article.description()))
                .reduce((a, b) -> a + "\n" + b)
                .orElse("");

        String mode = newsPenaltyScore <= -8
                ? "부정적인 이슈와 여행 주의사항을 우선해서"
                : "여행, 관광, 분위기, 먹거리 관점에서";

        try {
            String content = chatClientBuilder.build()
                    .prompt()
                    .system("너는 여행 추천 서비스의 뉴스 요약기다. 한국어로만 답하고, 기사에 없는 내용은 지어내지 마라.")
                    .user("""
                            도시: %s
                            국가: %s
                            요약 관점: %s

                            아래 기사 목록만 바탕으로 2문장 이내로 요약해라.
                            긍정 요소와 주의 요소가 같이 있으면 함께 반영해라.

                            %s
                            """.formatted(city, country, mode, articleBlock))
                    .call()
                    .content();

            return StringUtils.hasText(content) ? content.trim() : city + " 관련 뉴스 요약을 생성하지 못했습니다.";
        } catch (Exception e) {
            return city + " 관련 최근 기사 " + articles.size() + "건을 수집했습니다.";
        }
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    public record NewsApiResponse(String status, Integer totalResults, List<ArticleItem> articles) {}

    public record ArticleItem(
            String title,
            String url,
            String urlToImage,
            String description,
            String content
    ) {}
}
