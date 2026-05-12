type FetchCourseResult = {

    eventId: string;

    cleanedCourseData: any;

    courseLabel: string;

    displayCourseName: string;

    isOnline: boolean;

    safeGet: Function;
};

const safeGet = (
    val: any,
    fallback = 'Not specified'
) => {

    return val &&
    String(val).trim() !== ''
        ? String(val).trim()
        : fallback;
};

const tryParseJSON = (
    value: any
) => {

    if (typeof value !== "string") {
        return value;
    }

    try {

        return JSON.parse(value);

    } catch {

        return value;
    }
};

const cleanValue = (
    value: any
): any => {

    if (typeof value === "string") {

        return value
            .replace(/&[a-z]+;/gi, " ")
            .replace(/<[^>]*>?/gm, " ")
            .replace(/\t/g, " ")
            .replace(/\r/g, " ")
            .replace(/[ ]{2,}/g, " ")
            .trim();
    }

    if (Array.isArray(value)) {
        return value.map(cleanValue);
    }

    if (
        value &&
        typeof value === "object"
    ) {

        const cleanedObj: any = {};

        Object.entries(value)
            .forEach(([key, val]) => {

                cleanedObj[key] =
                    cleanValue(
                        tryParseJSON(val)
                    );
            });

        return cleanedObj;
    }

    return value;
};

export async function fetchAndNormalizeAolCourse(
    rawUrl: string,
    prettyLog?: Function
): Promise<FetchCourseResult> {

    if (
        !rawUrl ||
        typeof rawUrl !== 'string'
    ) {

        throw new Error(
            'A valid URL is required.'
        );
    }

    // ==========================================
    // URL NORMALIZATION
    // ==========================================

    let parsedUrlString =
        rawUrl.trim();

    if (
        !/^https?:\/\//i.test(
            parsedUrlString
        )
    ) {

        parsedUrlString =
            'https://' + parsedUrlString;
    }

    let urlObj: URL;

    try {

        urlObj =
            new URL(parsedUrlString);

        const allowedHosts = [
            'aolt.in',
            'www.aolt.in',
            'artofliving.online',
            'www.artofliving.online',
        ]

        if (
            !allowedHosts.includes(
                urlObj.hostname.toLowerCase(),
            )
        ) {

            throw new Error(
                'Please enter a valid Art of Living course link',
            )
        }

    } catch (error: any) {

        throw new Error(
            error?.message ||
            'Invalid Art of Living course URL',
        );
    }

    // ==========================================
    // EVENT ID EXTRACTION
    // ==========================================

    let eventId =
        urlObj.searchParams.get("event_id")
        ||
        urlObj.searchParams.get("id");

    if (!eventId) {

        const pathSegments =
            urlObj.pathname
                .split("/")
                .filter(Boolean);

        for (const segment of pathSegments) {

            if (/^\d{5,9}$/.test(segment)) {

                eventId = segment;

                break;
            }
        }
    }

    if (
        !eventId ||
        !/^\d+$/.test(eventId)
    ) {

        throw new Error(
            'Invalid event ID'
        );
    }

    prettyLog?.(
        "EVENT ID EXTRACTED",
        {
            originalUrl: rawUrl,
            parsedUrl: parsedUrlString,
            eventId
        }
    );

    // ==========================================
    // AOL API FETCH
    // ==========================================

    const apiURL =
        process.env.AOL_API_URL;

    if (!apiURL) {

        throw new Error(
            "AOL_API_URL missing"
        );
    }

    const params =
        new URLSearchParams();

    params.append(
        "event_id",
        eventId
    );

    params.append('url_reg_type', '');
    params.append('pkg_id', '');
    params.append('dis_id', '');
    params.append('g_dis', '');

    const controller =
        new AbortController()

    const timeout =
        setTimeout(() => {

            controller.abort()

        }, 15000)

    let apiResponse: Response

    try {

        apiResponse =
            await fetch(apiURL, {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8",

                    'Accept':
                        'application/json, text/javascript, */*; q=0.01'
                },

                body:
                    params.toString(),

                signal:
                controller.signal,
            })

    } catch (error: any) {

        if (
            error.name === 'AbortError'
        ) {

            throw new Error(
                'AOL API request timed out.',
            )
        }

        throw new Error(
            'Failed to connect to AOL servers.',
        )
    } finally {

        clearTimeout(timeout)
    }

    if (!apiResponse.ok) {

        throw new Error(
            'Unable to retrieve course details from AOL servers.'
        );
    }

    const responseText =
        await apiResponse.text();

    if (
        responseText
            .toLowerCase()
            .includes('<html')
    ) {

        throw new Error(
            'AOL API returned HTML instead of JSON.',
        )
    }

    if (responseText.length > 1000000) {

        throw new Error(
            'AOL API response too large.',
        )
    }

    let rawData;

    try {

        rawData =
            JSON.parse(responseText);

    } catch {

        throw new Error(
            "Invalid AOL API response"
        );
    }

    const courseData =
        Array.isArray(rawData)
            ? rawData?.[0]
            : rawData;

    if (
        !courseData ||
        typeof courseData !== 'object'
    ) {

        throw new Error(
            'Malformed AOL API response structure.',
        )
    }

    prettyLog?.(
        "AOL API RAW RESPONSE",
        courseData
    );

    // ==========================================
    // VALIDATION
    // ==========================================

    const courseName =
        courseData?.course_event_type_label
        ||
        courseData?.event_name
        ||
        courseData?.course_name;

    const hasMeaningfulData =
        Object.values(courseData)
            .some(
                (val) =>
                    val !== null &&
                    val !== '' &&
                    val !== undefined,
            )

    if (!hasMeaningfulData) {

        throw new Error(
            'Course data is empty.',
        )
    }

    const explicitError =
        (courseData?.is_error === 1 ||
            courseData?.is_error === "1")
        ||
        (courseData?.status === "error");

    if (
        !courseData ||
        !courseName ||
        explicitError
    ) {

        throw new Error(
            "Course inactive"
        );
    }

    // ==========================================
    // TEACHER PARSING
    // ==========================================

    let parsedTeachers: string[] = [];

    let contactNumbers: string[] = [];

    try {

        if (courseData.teacher_info) {

            const info =
                typeof courseData.teacher_info
                === 'string'

                    ? JSON.parse(
                        courseData.teacher_info
                    )

                    : courseData.teacher_info;

            if (Array.isArray(info)) {

                info.forEach((t: any) => {

                    if (t.teacher_name) {

                        const cleanTeacher =
                            String(
                                t.teacher_name || '',
                            ).trim()

                        if (cleanTeacher) {

                            parsedTeachers.push(
                                cleanTeacher,
                            )
                        }
                    }

                    if (t.teacher_phone) {

                        contactNumbers.push(
                            String(
                                t.teacher_phone,
                            )
                                .replace(/[^\d+]/g, '')
                                .trim()
                        );
                    }
                });
            }
        }

    } catch (e) {

        console.warn(
            "Teacher parse failed",
            e
        );
    }

    parsedTeachers =
        [...new Set(parsedTeachers)];

    // ==========================================
    // CLEANING
    // ==========================================

    const cleanedCourseData =
        cleanValue(courseData);

    const payloadSize =
        JSON.stringify(
            cleanedCourseData,
        ).length

    if (payloadSize > 500000) {

        throw new Error(
            'Course payload too large.',
        )
    }

    cleanedCourseData.teachers =
        parsedTeachers.length > 0

            ? parsedTeachers.join(", ")

            : "TBA";

    cleanedCourseData.contact_numbers =
        contactNumbers.length > 0

            ? [...new Set(contactNumbers)]
                .join(", ")

            : "Contact details available on registration page";

    // ==========================================
    // DISPLAY FORMATTING
    // ==========================================

    const isOnline =
        String(
            cleanedCourseData.address || ''
        )
            .toLowerCase()
            .includes('online');

    const courseLabel =
        cleanedCourseData.course_event_type_label
        ||
        cleanedCourseData.event_name
        ||
        "Art of Living Course";

    if (
        typeof courseLabel !== 'string' ||
        courseLabel.trim().length < 3
    ) {

        throw new Error(
            'Invalid course label received.',
        )
    }

    const displayCourseName =
        isOnline
            ? `Online ${courseLabel}`
            : courseLabel;

    if (
        !cleanedCourseData ||
        typeof cleanedCourseData !== 'object'
    ) {

        throw new Error(
            'Course normalization failed.',
        )
    }
    Object.freeze(cleanedCourseData)

    prettyLog?.(
        'AOL NORMALIZATION SUCCESS',
        {
            eventId,
            displayCourseName,
            isOnline,
        },
    )

    return {
        eventId,
        cleanedCourseData,
        courseLabel,
        displayCourseName,
        isOnline,
        safeGet
    };
}