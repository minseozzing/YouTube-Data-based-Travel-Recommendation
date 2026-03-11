package com.example.dahaeng.domain.auth.jwt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;

import com.example.dahaeng.domain.member.repository.MemberRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

class JwtFilterPathScopeTest {

	private static final RequestMatcher PROTECTED_MATCHER =
		PathPatternRequestMatcher.withDefaults().matcher("/api/private/**");

	@Test
	void jwtFilter_shouldSkipPublicPath() {
		ExposedJwtFilter filter = new ExposedJwtFilter(PROTECTED_MATCHER);
		MockHttpServletRequest request = request("GET", "/api/public/ping");

		assertThat(filter.shouldSkip(request)).isTrue();
	}

	@Test
	void jwtFilter_shouldRunOnProtectedPath() {
		ExposedJwtFilter filter = new ExposedJwtFilter(PROTECTED_MATCHER);
		MockHttpServletRequest request = request("GET", "/api/private/resource");

		assertThat(filter.shouldSkip(request)).isFalse();
	}

	@Test
	void jwtExceptionFilter_shouldSkipPublicPath() {
		ExposedJwtExceptionFilter filter = new ExposedJwtExceptionFilter(PROTECTED_MATCHER);
		MockHttpServletRequest request = request("GET", "/api/public/ping");

		assertThat(filter.shouldSkip(request)).isTrue();
	}

	@Test
	void jwtExceptionFilter_shouldRunOnProtectedPath() {
		ExposedJwtExceptionFilter filter = new ExposedJwtExceptionFilter(PROTECTED_MATCHER);
		MockHttpServletRequest request = request("GET", "/api/private/resource");

		assertThat(filter.shouldSkip(request)).isFalse();
	}

	@Test
	void bothFilters_shouldSkipOptionsPreflight() {
		RequestMatcher matcher = new OrRequestMatcher(
			PathPatternRequestMatcher.withDefaults().matcher("/api/**"),
			PathPatternRequestMatcher.withDefaults().matcher("/member/**")
		);

		MockHttpServletRequest optionsRequest = request("OPTIONS", "/api/private/resource");

		assertThat(new ExposedJwtFilter(matcher).shouldSkip(optionsRequest)).isTrue();
		assertThat(new ExposedJwtExceptionFilter(matcher).shouldSkip(optionsRequest)).isTrue();
	}

	private static class ExposedJwtFilter extends JwtFilter {
		ExposedJwtFilter(RequestMatcher matcher) {
			super(mock(JwtUtil.class), mock(MemberRepository.class), matcher);
		}

		boolean shouldSkip(MockHttpServletRequest request) {
			return shouldNotFilter(request);
		}
	}

	private static class ExposedJwtExceptionFilter extends JwtExceptionFilter {
		ExposedJwtExceptionFilter(RequestMatcher matcher) {
			super(new ObjectMapper(), matcher);
		}

		boolean shouldSkip(MockHttpServletRequest request) {
			return shouldNotFilter(request);
		}
	}

	private MockHttpServletRequest request(String method, String path) {
		MockHttpServletRequest request = new MockHttpServletRequest(method, path);
		request.setServletPath(path);
		return request;
	}
}
