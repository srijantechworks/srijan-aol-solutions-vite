import express from 'express'

import { fetchAndNormalizeAolCourse }
    from '../services/aolApi.ts'

const router = express.Router()

router.post(
    '/generate',
    async (req, res) => {

        try {

            const { url } = req.body

            if (!url) {

                return res
                    .status(400)
                    .json({
                        error:
                            'Course URL is required',
                    })
            }

            const result =
                await fetchAndNormalizeAolCourse(
                    url,
                    console.log
                )

            return res.json({
                success: true,

                eventId:
                result.eventId,

                displayCourseName:
                result.displayCourseName,

                isOnline:
                result.isOnline,

                cleanedCourseData:
                result.cleanedCourseData,
            })

        } catch (error: any) {

            console.error(error)

            return res
                .status(500)
                .json({
                    error:
                        error.message
                        ||
                        'Failed to fetch AOL course',
                })
        }
    },
)

export default router